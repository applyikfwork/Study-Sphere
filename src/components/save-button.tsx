"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SaveButtonProps {
  contentId: string
  contentType: 'note' | 'pyq' | 'sample_paper'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  showText?: boolean
  className?: string
}

export function SaveButton({ 
  contentId, 
  contentType, 
  size = 'sm',
  variant = 'outline',
  showText = true,
  className = ''
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const checkSavedStatus = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setIsChecking(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoggedIn(false)
      setIsChecking(false)
      return
    }

    setIsLoggedIn(true)

    try {
      const { data } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single()

      setIsSaved(!!data)
    } catch {
      setIsSaved(false)
    }
    setIsChecking(false)
  }, [contentId, contentType])

  useEffect(() => {
    checkSavedStatus()
  }, [checkSavedStatus])

  async function handleSave() {
    const supabase = createClient()
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    setIsLoading(true)

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)

        if (error) throw error
        setIsSaved(false)
      } else {
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: user.id,
            content_id: contentId,
            content_type: contentType
          })

        if (error) {
          if (error.code === '23505') {
            setIsSaved(true)
            return
          }
          throw error
        }
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button 
        size={size} 
        variant={variant}
        className={`gap-1.5 ${className}`}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {showText && 'Save'}
      </Button>
    )
  }

  if (!isLoggedIn) {
    return (
      <Button 
        size={size} 
        variant={variant}
        className={`gap-1.5 ${className}`}
        onClick={() => window.location.href = '/login'}
      >
        <Bookmark className="h-4 w-4" />
        {showText && 'Save'}
      </Button>
    )
  }

  return (
    <Button 
      size={size} 
      variant={isSaved ? 'default' : variant}
      className={`gap-1.5 ${isSaved ? 'bg-primary text-white' : ''} ${className}`}
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {showText && (isSaved ? 'Saved' : 'Save')}
    </Button>
  )
}
