'use client'

import { Button, Input, Card, CardContent, Modal, FileUpload, Select } from '@/components/ui'
import { useState } from 'react'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">INTTLNT Component Demo</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Input</h2>
        <Input label="Name" placeholder="Enter your name" />
        <Input label="Email" type="email" error="Invalid email" />
      </section>

      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Select</h2>
        <Select
          label="Choose option"
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Card</h2>
        <Card>
          <CardContent>This is a card with some content.</CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">File Upload</h2>
        <FileUpload label="Upload document" accept=".pdf,.jpg" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
        >
          <p>Modal content goes here.</p>
        </Modal>
      </section>
    </main>
  )
}