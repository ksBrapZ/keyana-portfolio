// pages/toolkit.tsx
import Head from 'next/head';
import { useState } from 'react';
import { NextPage } from 'next';
import { ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

// Define types for our toolkit data
interface ToolkitItem {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

interface BookItem {
  id: number;
  title: string;
  author: string;
  description: string;
  url: string;
  tag: string;
}

interface PodcastItem {
  id: number;
  name: string;
  hosts: string;
  description: string;
  url: string;
  type: string;
}

interface TVFilmItem {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

interface MusicItem {
  id: number;
  song: string;
  artist: string;
  album: string;
  description: string;
  url: string;
  type: string;
}

interface MediaData {
  books: BookItem[];
  podcasts: PodcastItem[];
  tvfilm: TVFilmItem[];
  music: MusicItem[];
}

interface ToolkitData {
  tools: ToolkitItem[];
  products: ToolkitItem[];
  media: MediaData;
  people: ToolkitItem[];
}

// Import the JSON data
import toolkitData from '../data/toolkit.json';

// Color mapping for types as Badge variant
const getTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  const typeMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    // Development tools
    'Development': 'default',
    'Design': 'secondary',
    'Productivity': 'outline',
    
    // Products
    'Vehicles': 'destructive',
    'Tech': 'default',
    'Audio': 'secondary',
    'Gear': 'outline',
    'Home Goods': 'outline',
    
    // Default for any other type
    'default': 'default'
  };
  
  return typeMap[type] || typeMap.default;
};

const Toolkit: NextPage = () => {
  const [activeMainTab, setActiveMainTab] = useState<string>('tools');
  const [activeMediaTab, setActiveMediaTab] = useState<string>('books');
  
  // Reusable link component
  const ExternalItemLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a 
      href={href} 
      className="text-primary hover:text-primary/80 transition-colors flex items-center" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLink size={14} className="ml-1 opacity-70" />
    </a>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-light">
      <Head>
        <title>Toolkit | Keyana Sapp</title>
        <meta name="description" content="Keyana Sapp's toolkit of favorite tools, products, media, and people" />
        
        {/* Favicon configuration */}
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Header />

      <main className="py-3 flex-1">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
          <div className="w-full max-w-4xl mx-auto mb-6">
            <h1 className="text-2xl font-medium mb-3">Toolkit</h1>
            <p className="text-muted-foreground">
              A curated collection of tools, products, media, and people that I find valuable, use regularly, or admire.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <Tabs defaultValue="tools" onValueChange={setActiveMainTab} value={activeMainTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
              </TabsList>

              {/* Tools Tab */}
              <TabsContent value="tools">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {toolkitData.tools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">
                          <ExternalItemLink href={tool.url}>
                            {tool.name}
                          </ExternalItemLink>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tool.description}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeVariant(tool.type)}>
                            {tool.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {toolkitData.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <ExternalItemLink href={product.url}>
                            {product.name}
                          </ExternalItemLink>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.description}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeVariant(product.type)}>
                            {product.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media">
                <Tabs defaultValue="books" onValueChange={setActiveMediaTab} value={activeMediaTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6 w-full">
                    <TabsTrigger value="books">Books</TabsTrigger>
                    <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                    <TabsTrigger value="tvfilm">TV & Film</TabsTrigger>
                    <TabsTrigger value="music">Music</TabsTrigger>
                  </TabsList>

                  {/* Books Tab */}
                  <TabsContent value="books">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Title</TableHead>
                          <TableHead className="w-[150px]">Author</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Genre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolkitData.media.books.map((book) => (
                          <TableRow key={book.id}>
                            <TableCell className="font-medium">
                              <ExternalItemLink href={book.url}>
                                {book.title}
                              </ExternalItemLink>
                            </TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell className="text-muted-foreground">{book.description}</TableCell>
                            <TableCell>
                              <Badge variant={getTypeVariant(book.tag)}>
                                {book.tag}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Podcasts Tab */}
                  <TabsContent value="podcasts">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead className="w-[150px]">Hosts</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolkitData.media.podcasts.map((podcast) => (
                          <TableRow key={podcast.id}>
                            <TableCell className="font-medium">
                              <ExternalItemLink href={podcast.url}>
                                {podcast.name}
                              </ExternalItemLink>
                            </TableCell>
                            <TableCell>{podcast.hosts}</TableCell>
                            <TableCell className="text-muted-foreground">{podcast.description}</TableCell>
                            <TableCell>
                              <Badge variant={getTypeVariant(podcast.type)}>
                                {podcast.type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* TV & Film Tab */}
                  <TabsContent value="tvfilm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolkitData.media.tvfilm.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <ExternalItemLink href={item.url}>
                                {item.name}
                              </ExternalItemLink>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{item.description}</TableCell>
                            <TableCell>
                              <Badge variant={getTypeVariant(item.type)}>
                                {item.type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Music Tab */}
                  <TabsContent value="music">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Song</TableHead>
                          <TableHead className="w-[150px]">Artist</TableHead>
                          <TableHead className="w-[150px]">Album</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolkitData.media.music.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <ExternalItemLink href={item.url}>
                                {item.song}
                              </ExternalItemLink>
                            </TableCell>
                            <TableCell>{item.artist}</TableCell>
                            <TableCell>{item.album}</TableCell>
                            <TableCell className="text-muted-foreground">{item.description}</TableCell>
                            <TableCell>
                              <Badge variant={getTypeVariant(item.type)}>
                                {item.type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* People Tab */}
              <TabsContent value="people">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {toolkitData.people.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">
                          <ExternalItemLink href={person.url}>
                            {person.name}
                          </ExternalItemLink>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{person.description}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeVariant(person.type)}>
                            {person.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Toolkit;