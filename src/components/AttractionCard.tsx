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
import { Attraction, MarkdownContent } from '@/lib/data'

interface Props {
  attraction: Attraction & MarkdownContent
  onClose: () => void
}

export default function AttractionCard({ attraction, onClose }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{attraction.name}</CardTitle>
          <CardDescription>{attraction.coordinate.join(', ')}</CardDescription>
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
            <ReactMarkdown>{attraction.content}</ReactMarkdown>
          </article>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </>
  )
}
