declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link'
  import * as React from 'react'

  type LinkProps = Omit<NextLinkProps, 'href'> & {
    href: string
    children: React.ReactNode
    className?: string
  }

  const Link: React.FC<LinkProps>
  export default Link
}
