import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, CircuitBoard, Code, ToyBrick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { products, courses } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import AiRecommendations from '@/components/ai-recommendations';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-image');
  const kits = products.filter(p => p.category === 'Kits').slice(0, 4);
  const components = products.filter(p => p.category === 'Components').slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative h-[60vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 text-center text-primary-foreground">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Build The Future, One Component at a Time
          </h1>
          <p className="max-w-3xl text-lg text-primary-foreground/80 md:text-xl">
            Discover a universe of high-quality robotic parts, kits, and educational resources. Your next creation starts here.
          </p>
          <Button asChild size="lg" className="font-headline text-lg">
            <Link href="/shop">
              Explore Shop <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <ToyBrick className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline">Robotic Kits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">All-in-one kits to start your journey into robotics.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <CircuitBoard className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline">Components</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A wide range of sensors, motors, and controllers.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <Code className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Learn from experts and master new skills in robotics.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <Bot className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline">AI Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get personalized recommendations for your projects.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Featured Kits</h2>
          <Button variant="link" asChild>
            <Link href="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {kits.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Top Components</h2>
           <Button variant="link" asChild>
            <Link href="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {components.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Popular Courses</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => {
            const courseImage = placeholderImages.find(p => p.id === course.imageId);
            return (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {courseImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={courseImage.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                        data-ai-hint={courseImage.imageHint}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-headline text-xl font-semibold">{course.title}</h3>
                    <p className="mt-2 text-muted-foreground">{course.description}</p>
                    <Button asChild className="mt-4">
                      <Link href="#">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8 md:mb-24">
        <AiRecommendations />
      </section>
    </div>
  );
}
