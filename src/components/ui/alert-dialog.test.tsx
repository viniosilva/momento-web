import { describe, expect, it, vi } from 'vitest'

// Mock @base-ui/react/dialog at the TOP (vi.mock is hoisted)
vi.mock('@base-ui/react/dialog', () => ({
  Root: ({ children, ...props }: any) => <div data-slot="alert-dialog" {...props}>{children}</div>,
  Portal: ({ children, ...props }: any) => <div data-slot="alert-dialog-portal" {...props}>{children}</div>,
  Backdrop: ({ children, ...props }: any) => <div data-slot="alert-dialog-overlay" {...props}>{children}</div>,
  Popup: ({ children, ...props }: any) => <div data-slot="alert-dialog-content" {...props}>{children}</div>,
  Title: ({ children, ...props }: any) => <h2 data-slot="alert-dialog-title" {...props}>{children}</h2>,
  Description: ({ children, ...props }: any) => <p data-slot="alert-dialog-description" {...props}>{children}</p>,
  Close: ({ children, render, ...props }: any) => <button data-slot="alert-dialog-action" {...props}>{render || children}</button>,
}))

// Now import after mock
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'

describe('AlertDialog Components', () => {
  it('should export AlertDialog', () => {
    expect(AlertDialog).toBeDefined()
  })
  
  it('should export AlertDialogContent', () => {
    expect(AlertDialogContent).toBeDefined()
  })
  
  it('should render AlertDialog with children', () => {
    expect(() => {
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Desc</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    }).not.toThrow()
  })
})
