'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export function ZoomParallax({ images = [] }) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{images.slice(0, 7).map((item, index) => {
					const { src, alt, id, title, artist, category, href } = item;
					const scale = scales[index % scales.length];
					const linkTarget = href || (id ? `/artworks/${id}` : null);

					const imageContent = (
						<div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-soft group cursor-pointer">
							<img
								src={src || '/placeholder.svg'}
								alt={alt || title || `Parallax image ${index + 1}`}
								className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
							/>
							{(title || artist) && (
								<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-white">
									{category && (
										<p className="text-[10px] uppercase font-semibold tracking-widest text-white/75 truncate">
											{category}
										</p>
									)}
									{title && (
										<p className="font-display text-sm sm:text-base font-semibold leading-tight text-white truncate group-hover:text-cream transition">
											{title}
										</p>
									)}
									{artist && (
										<p className="text-[11px] text-white/80 truncate">
											by {artist}
										</p>
									)}
								</div>
							)}
						</div>
					);

					return (
						<motion.div
							key={id ?? index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw] [&>a>div]:!-top-[30vh] [&>a>div]:!left-[5vw] [&>a>div]:!h-[30vh] [&>a>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw] [&>a>div]:!-top-[10vh] [&>a>div]:!-left-[25vw] [&>a>div]:!h-[45vh] [&>a>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw] [&>a>div]:!left-[27.5vw] [&>a>div]:!h-[25vh] [&>a>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw] [&>a>div]:!top-[27.5vh] [&>a>div]:!left-[5vw] [&>a>div]:!h-[25vh] [&>a>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw] [&>a>div]:!top-[27.5vh] [&>a>div]:!-left-[22.5vw] [&>a>div]:!h-[25vh] [&>a>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw] [&>a>div]:!top-[22.5vh] [&>a>div]:!left-[25vw] [&>a>div]:!h-[15vh] [&>a>div]:!w-[15vw]' : ''} `}
						>
							{linkTarget ? (
								<Link href={linkTarget} className="contents">
									{imageContent}
								</Link>
							) : (
								imageContent
							)}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
