import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from './card'

describe('Card', () => {
  it('renders Card with default props', () => {
    render(<Card>
      <CardContent>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardDescription>Description</CardDescription>
        <CardFooter>Footer</CardFooter>
      </CardContent>
    </Card>)
    
    expect(screen.getByText('Title')).toBeDefined()
    expect(screen.getByText('Action')).toBeDefined()
    expect(screen.getByText('Description')).toBeDefined()
    expect(screen.getByText('Footer')).toBeDefined()
  })

  it('renders Card with small size', () => {
    render(<Card size="sm">Small Card</Card>)
    const card = screen.getByText('Small Card')
    expect(card).toBeDefined()
  })
})
