import ReactMarkdown from 'react-markdown'
import type { Attraction } from '@/lib/attractions'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'

interface Props {
  attraction: Attraction
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
          <ReactMarkdown>{attraction.content}</ReactMarkdown>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </>
  )
}
