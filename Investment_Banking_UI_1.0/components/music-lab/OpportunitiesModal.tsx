import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const organizations = [
    {
        name: "SoundGirls",
        description: "Support and community for women working in professional audio and music production.",
        url: "https://soundgirls.org/",
        icon: Users
    },
    {
        name: "Girls Who Code",
        description: "Closing the gender gap in technology and changing the image of what a programmer looks like.",
        url: "https://girlswhocode.com/",
        icon: Users
    },
    {
        name: "Women’s Audio Mission",
        description: "Dedicated to the advancement of women/gender-expansive people in music production and recording arts.",
        url: "https://womensaudiomission.org/",
        icon: Users
    }
];

const learningResources = [
    {
        name: "Berklee Online",
        description: "Music Production 101 - Learn the art of music production from Berklee College of Music experts.",
        url: "https://online.berklee.edu/",
        icon: GraduationCap
    },
    {
        name: "Coursera",
        description: "Electronic Music Production Specialization - Master the tools and techniques of modern production.",
        url: "https://www.coursera.org/",
        icon: GraduationCap
    },
    {
        name: "Ableton Learning Music",
        description: "Get started with music making directly in your browser. No prior experience needed.",
        url: "https://learningmusic.ableton.com/",
        icon: GraduationCap
    }
];

export function OpportunitiesModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-music-accent/30 hover:bg-music-accent/50 text-music-primary border-music-primary/30 hover:border-music-primary px-4 py-2 rounded-full transition-all duration-300 gap-2 font-mono text-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    Opportunities
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-music-dark border-music-light/20 text-white">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold text-music-primary flex items-center gap-3">
                        <Sparkles className="w-8 h-8" />
                        Future Pathways
                    </DialogTitle>
                    <DialogDescription className="text-music-light/80 text-lg">
                        Explore resources, communities, and learning opportunities to take your passion for music and tech to the next level.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Organizations Section */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-music-secondary" />
                            Organizations & Communities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {organizations.map((org) => (
                                <ResourceCard key={org.name} resource={org} />
                            ))}
                        </div>
                    </section>

                    {/* Learning Section */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                            Learning Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {learningResources.map((item) => (
                                <ResourceCard key={item.name} resource={item} />
                            ))}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ResourceCard({ resource }: { resource: any }) {
    const Icon = resource.icon;
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group h-full"
        >
            <Card className="h-full bg-white/5 border-white/10 hover:border-music-primary/50 hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white group-hover:text-music-primary transition-colors flex justify-between items-start gap-2">
                        {resource.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-music-light/70">
                        {resource.description}
                    </CardDescription>
                </CardContent>
            </Card>
        </a>
    );
}
