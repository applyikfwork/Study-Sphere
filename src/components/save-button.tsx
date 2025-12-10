"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  useEffect(() => {
    checkSavedStatus()
  }, [contentId])

  async function checkSavedStatus() {
    const supabase = createClient()
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoggedIn(false)
      return
    }

    setIsLoggedIn(true)

    const { data } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .single()

    setIsSaved(!!data)
  }

  async function handleSave() {
    const supabase = createClient()
    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save items",
        variant: "destructive"
      })
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
        toast({
          title: "Removed",
          description: "Item removed from your saved list"
        })
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
        toast({
          title: "Saved!",
          description: "Item saved to your profile"
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Error",
        description: "Could not save item. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
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
