import ReactMarkdown from 'react-markdown'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { AttractionMeta, MarkdownContent, RouteMeta } from '@/lib/data'

interface Props {
  head: AttractionMeta | RouteMeta
  content: string
  onClose?: () => void
}

export default function Introduction({ head, content, onClose }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{head.name}</CardTitle>
          <CardDescription>
            {'coordinate' in head
              ? head.coordinate.join(', ')
              : head.points.join(', ')}
          </CardDescription>
          <CardAction>
            <Button
              variant={'ghost'}
              onClick={onClose}
              className="text-2xl leading-none"
              aria-label="关闭"
            >
              ×
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <article className="[&_img]:w-full">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </>
  )
}
