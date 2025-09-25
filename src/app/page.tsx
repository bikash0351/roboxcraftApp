
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, CircuitBoard, Code, ToyBrick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { products, courses } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

export default function Home() {
  const kits = products.filter(p => p.category === 'Kits').slice(0, 4);
  const components = products.filter(p => p.category === 'Components').slice(0, 4);
  const posters = placeholderImages.filter(p => p.id.startsWith('hero-poster-'));

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="w-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {posters.map((poster, index) => (
              <CarouselItem key={poster.id}>
                <div className="relative w-full aspect-video">
                  <Image
                    src={poster.imageUrl}
                    alt={poster.description}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={poster.imageHint}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center text-center p-2">
            <CardHeader className="p-2">
              <ToyBrick className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-base">Robotic Kits</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground">All-in-one kits to start your journey into robotics.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center p-2">
            <CardHeader className="p-2">
              <CircuitBoard className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-base">Components</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground">A wide range of sensors, motors, and controllers.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center p-2">
            <CardHeader className="p-2">
              <Code className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-base">Courses</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground">Learn from experts and master new skills in robotics.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center p-2">
            <CardHeader className="p-2">
              <Bot className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-base">AI Hub</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground">Get personalized recommendations for your projects.</p>
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
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {components.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
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
    </div>
  );
}
    