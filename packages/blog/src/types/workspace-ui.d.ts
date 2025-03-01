declare module '@workspace/ui' {
  export const Container: React.FC<{ children: React.ReactNode; className?: string }>
}

declare module '@workspace/ui/components/card' {
  interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

  export const Card: React.ForwardRefExoticComponent<CardProps>
  export const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps>
  export const CardTitle: React.ForwardRefExoticComponent<CardTitleProps>
  export const CardDescription: React.ForwardRefExoticComponent<CardDescriptionProps>
}
