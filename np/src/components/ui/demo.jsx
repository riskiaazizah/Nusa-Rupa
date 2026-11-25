'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ZoomParallax } from "@/components/ui/zoom-parallax";

const TIGA_PARALLAX_IMAGES = [
	{
		src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
		alt: 'Peatland forest in smoke',
		title: 'Echoes of Peatland',
		category: 'Environment',
		artist: 'Bima Gambut',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=1200&q=80',
		alt: 'Orangutan in rainforest canopy',
		title: 'The Last Gaze',
		category: 'Fauna',
		artist: 'Sari Kalimantan',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
		alt: 'Rainforest misty canopy',
		title: 'Crown of Borneo',
		category: 'Flora',
		artist: 'Dewi Adat',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
		alt: 'Rangkong hornbill in flight',
		title: 'Winged Messenger',
		category: 'Conservation & Hope',
		artist: 'Bima Gambut',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
		alt: 'Dayak indigenous community',
		title: 'Keepers of the Grove',
		category: 'Culture & Heritage',
		artist: 'Dewi Adat',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
		alt: 'Charred timber and ember glow',
		title: 'Aftermath in Silence',
		category: 'Social Impact',
		artist: 'Sari Kalimantan',
		href: '/#collection',
	},
	{
		src: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=80',
		alt: 'Wild endemic orchid bloom',
		title: 'Resilience in Petals',
		category: 'Flora',
		artist: 'Dewi Adat',
		href: '/#collection',
	},
];

export default function DefaultDemo() {
	return (
		<main className="min-h-screen w-full bg-white text-ink">
			<div className="relative flex h-[50vh] flex-col items-center justify-center px-4 text-center">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,rgba(31,107,69,0.12),transparent_60%)]',
						'blur-[40px]',
					)}
				/>
				<p className="text-xs font-semibold uppercase tracking-widest text-mute mb-2">
					TIGA · Art for Earth
				</p>
				<h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-ink">
					Scroll Down for Zoom Parallax
				</h1>
				<p className="mt-3 max-w-lg text-sm sm:text-base text-mute">
					Experience Indonesia&apos;s forests, wildlife, and frontline communities in an immersive parallax scroll.
				</p>
			</div>
			<ZoomParallax images={TIGA_PARALLAX_IMAGES} />
			<div className="h-[30vh]" />
		</main>
	);
}
