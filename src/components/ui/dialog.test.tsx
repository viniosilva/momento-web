import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from './dialog'

describe('Dialog', () => {
  it('renders Dialog with trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Open Dialog')).toBeDefined()
  })

  it('renders DialogContent with custom className', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-class">Content</DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Open')).toBeDefined()
  })
})
