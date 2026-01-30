'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Settings, Trophy, BookOpen, Users, Plus, ArrowRight } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { createRoomAction } from '@/app/actions/game'

export function DashboardScreen() {
  const router = useRouter()
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [roomIdInput, setRoomIdInput] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = async () => {
    try {
      const { roomId } = await createRoomAction()
      router.push(`/room/${roomId}`)
    } catch (error) {
      console.error('Failed to create room:', error)
      setError('Không thể tạo phòng. Vui lòng thử lại.')
    }
  }

  const handleJoinRoom = () => {
    if (!roomIdInput.trim()) {
      setError('Vui lòng nhập ID phòng!')
      return
    }
    router.push(`/room/${roomIdInput.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-fuchsia-50 to-rose-50 dark:from-pink-950/20 dark:via-fuchsia-950/20 dark:to-rose-950/20">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Chào mừng đến Nhà bếp!
            </h1>
            <p className="text-lg text-muted-foreground">
              Chọn chế độ chơi và bắt đầu nấu ăn cùng Myna! 🍳
            </p>
          </div>

          {/* Game Mode Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Room */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Tạo Phòng Mới</CardTitle>
                <CardDescription>Tạo phòng và mời bạn bè cùng chơi</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full h-14 text-lg" onClick={handleCreateRoom}>
                  <Plus className="h-5 w-5 mr-2" />
                  Tạo Phòng
                </Button>
              </CardContent>
            </Card>

            {/* Join Room */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Vào Phòng</CardTitle>
                <CardDescription>Nhập ID phòng để tham gia</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg border-2 hover:bg-accent/10"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Vào Phòng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <p className="font-medium">Bảng xếp hạng</p>
                <p className="text-xs text-muted-foreground">Sắp ra mắt</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto text-accent mb-2" />
                <p className="font-medium">Hướng dẫn</p>
                <p className="text-xs text-muted-foreground">Học cách chơi</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
              <CardContent className="pt-6 text-center">
                <Settings className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">Cài đặt</p>
                <p className="text-xs text-muted-foreground">Tùy chỉnh</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Room Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nhập ID Phòng</DialogTitle>
              <DialogDescription>Nhập mã phòng mà bạn bè đã chia sẻ để tham gia.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Nhập ID phòng (VD: AX92)"
                  value={roomIdInput}
                  onChange={(e) => {
                    setRoomIdInput(e.target.value)
                    setError('') // Clear error on typing
                  }}
                  className="text-center text-lg tracking-widest uppercase"
                />
                {error && (
                  <p className="text-sm text-red-500 font-medium text-center shake">{error}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleJoinRoom}>Vào Phòng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
