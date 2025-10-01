
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, CircuitBoard, Code, Loader2, ToyBrick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { courses, type Product } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [kits, setKits] = useState<Product[]>([]);
  const [components, setComponents] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const posters = placeholderImages.filter(p => p.id.startsWith('hero-poster-'));

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
 
  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        
        const kitsQuery = query(productsRef, where("category", "==", "Kits"), limit(4));
        const componentsQuery = query(productsRef, where("category", "==", "Components"), limit(4));
        
        const [kitsSnapshot, componentsSnapshot] = await Promise.all([
          getDocs(kitsQuery),
          getDocs(componentsQuery)
        ]);

        const kitsData = kitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const componentsData = componentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        setKits(kitsData);
        setComponents(componentsData);
      } catch (error) {
        console.error("Error fetching products for homepage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="w-full relative">
        <Carousel
          setApi={setApi}
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                current === index ? "w-4 bg-primary" : "bg-primary/50"
              )}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-center">Explore Our Universe</h2>
        <div className="mt-6 grid grid-cols-2 gap-4">
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
      </section>
      
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Featured Kits</h2>
          <Button variant="link" asChild>
            <Link href="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
         {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {kits.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Top Components</h2>
           <Button variant="link" asChild>
            <Link href="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
         {loading ? (
           <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {components.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12 md:my-16">
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
