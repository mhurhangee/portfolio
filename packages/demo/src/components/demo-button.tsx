import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { ChevronRight, Image as ImageIcon, ExternalLink } from 'lucide-react';

export function DemoButton() {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Enhanced Demo Button</h3>
      </div>
      
      <div className="relative h-32 w-full rounded-md overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=300" 
          alt="Demo illustration"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <p className="text-sm text-gray-500">
        This component integrates UI components, Lucide icons, and Next.js features
      </p>
      
      <div className="flex gap-2">
        <Button>
          Primary Action
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        
        <Link href="#" passHref>
          <Button variant="outline" size="sm">
            Learn More
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
