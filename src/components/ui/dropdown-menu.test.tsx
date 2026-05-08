import { describe, expect, it } from 'vitest'

// Simple export test for dropdown-menu.tsx
describe('dropdown-menu exports', () => {
  it('should export DropdownMenu', async () => {
    const exports = await import('./dropdown-menu')
    expect(exports.DropdownMenu).toBeDefined()
  })
  
  it('should export DropdownMenuTrigger', async () => {
    const exports = await import('./dropdown-menu')
    expect(exports.DropdownMenuTrigger).toBeDefined()
  })
  
  it('should export DropdownMenuContent', async () => {
    const exports = await import('./dropdown-menu')
    expect(exports.DropdownMenuContent).toBeDefined()
  })
  
  it('should export DropdownMenuItem', async () => {
    const exports = await import('./dropdown-menu')
    expect(exports.DropdownMenuItem).toBeDefined()
  })
})
