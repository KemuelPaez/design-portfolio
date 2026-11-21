document.documentElement.classList.add('js');

document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToTarget(target) {
	if (!target) return;
	const header = document.querySelector('.site-header');
	const headerHeight = header ? header.offsetHeight : 0;
	const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
	window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener('click', (event) => {
		const href = link.getAttribute('href');
		if (!href || href === '#') return;
		const target = document.querySelector(href);
		if (!target) return;
		event.preventDefault();
		scrollToTarget(target);
		history.replaceState(null, '', href);
	});
});

document.querySelectorAll('.project-btn[data-target]').forEach((button) => {
	button.addEventListener('click', () => {
		const target = document.getElementById(button.dataset.target);
		scrollToTarget(target);
	});
});

// Progressive typewriter effect; content remains visible if JavaScript is unavailable.
if (!reducedMotion) {
	const twName = document.getElementById('typewriter-name');
	const twTitles = document.getElementById('typewriter-titles');
	if (twName && twTitles) {
		const name = twName.dataset.name || 'Kemuel Kyle Paez';
		const titles = twTitles.dataset.titles || '';
		twName.textContent = '';
		twTitles.textContent = '';
		let nameIndex = 0;
		const nameTimer = window.setInterval(() => {
			if (nameIndex < name.length) {
				twName.textContent += name[nameIndex++];
			} else {
				window.clearInterval(nameTimer);
				let titleIndex = 0;
				const titleTimer = window.setInterval(() => {
					if (titleIndex < titles.length) {
						twTitles.textContent += titles[titleIndex++];
					} else {
						window.clearInterval(titleTimer);
					}
				}, 30);
			}
		}, 60);
	}
}

// Scroll-triggered fade-in animations
if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver((entries, activeObserver) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.querySelectorAll('.fade-in').forEach((element) => element.classList.add('visible'));
				activeObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

	document.querySelectorAll('section').forEach((section) => observer.observe(section));
} else {
	document.querySelectorAll('.fade-in').forEach((element) => element.classList.add('visible'));
}

// Accessible mobile navigation
const hamburger = document.getElementById('hamburger');
const modalNav = document.getElementById('modal-nav');
const closeModal = document.getElementById('close-modal');

function openMenu() {
	modalNav.classList.add('active');
	modalNav.setAttribute('aria-hidden', 'false');
	hamburger.setAttribute('aria-expanded', 'true');
	hamburger.setAttribute('aria-label', 'Close navigation');
	document.body.style.overflow = 'hidden';
	closeModal?.focus();
}

function closeMenu({ restoreFocus = true } = {}) {
	modalNav.classList.remove('active');
	modalNav.setAttribute('aria-hidden', 'true');
	hamburger.setAttribute('aria-expanded', 'false');
	hamburger.setAttribute('aria-label', 'Open navigation');
	document.body.style.overflow = '';
	if (restoreFocus) hamburger.focus();
}

if (hamburger && modalNav && closeModal) {
	hamburger.addEventListener('click', () => {
		modalNav.classList.contains('active') ? closeMenu() : openMenu();
	});
	closeModal.addEventListener('click', () => closeMenu());
	modalNav.addEventListener('click', (event) => {
		if (event.target === modalNav) closeMenu();
		if (event.target.closest('a[href^="#"]')) closeMenu({ restoreFocus: false });
	});

	document.addEventListener('keydown', (event) => {
		if (!modalNav.classList.contains('active')) return;
		if (event.key === 'Escape') closeMenu();
		if (event.key === 'Tab') {
			const focusable = [...modalNav.querySelectorAll('button, a[href]')].filter((element) => !element.disabled);
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	});
}

// Make gallery media keyboard-operable and give previews meaningful labels.
document.querySelectorAll('[data-bs-target="#adModal"], [data-bs-target="#videoModal"]').forEach((media) => {
	if (!media.hasAttribute('tabindex')) media.setAttribute('tabindex', '0');
	media.setAttribute('role', 'button');
	const title = media.dataset.title || 'Open project preview';
	media.setAttribute('aria-label', `${title}: open preview`);
	media.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			media.click();
		}
	});
});

// Ad modal functionality
const adModal = document.getElementById('adModal');
const modalImage = document.getElementById('modalImage');
const adModalLabel = document.getElementById('adModalLabel');

if (adModal && modalImage && adModalLabel) {
	adModal.addEventListener('show.bs.modal', (event) => {
		const trigger = event.relatedTarget;
		const imgSrc = trigger?.getAttribute('data-img');
		const adTitle = trigger?.getAttribute('data-title') || 'Project preview';
		if (imgSrc) modalImage.src = imgSrc;
		modalImage.alt = adTitle;
		adModalLabel.textContent = adTitle;
	});
}

// Video modal functionality
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const videoModalLabel = document.getElementById('videoModalLabel');

if (videoModal && modalVideo && videoModalLabel) {
	videoModal.addEventListener('show.bs.modal', (event) => {
		const trigger = event.relatedTarget;
		const videoSrc = trigger?.getAttribute('data-video');
		const videoTitle = trigger?.getAttribute('data-title') || 'Video preview';
		if (videoSrc) modalVideo.src = videoSrc;
		videoModalLabel.textContent = videoTitle;
		modalVideo.setAttribute('aria-label', videoTitle);
	});

	videoModal.addEventListener('hidden.bs.modal', () => {
		modalVideo.pause();
		modalVideo.removeAttribute('src');
		modalVideo.load();
	});
}

// Horizontal scroll controls for the reel gallery (left / right buttons)
document.querySelectorAll('.reel-gallery-wrapper').forEach(wrapper => {
	const track = wrapper.querySelector('.reel-gallery');
	const btnLeft = wrapper.querySelector('.scroll-btn.left');
	const btnRight = wrapper.querySelector('.scroll-btn.right');
	if (!track || !btnLeft || !btnRight) return;

	const getScrollDistance = () => Math.max(track.clientWidth * 0.8, 300);

	const updateButtons = () => {
		window.requestAnimationFrame(() => {
			const atStart = track.scrollLeft <= 5;
			const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
			btnLeft.disabled = atStart;
			btnRight.disabled = atEnd;
			btnLeft.style.opacity = atStart ? '0.35' : '1';
			btnRight.style.opacity = atEnd ? '0.35' : '1';
		});
	};

	btnLeft.addEventListener('click', () => {
		track.scrollBy({ left: -getScrollDistance(), behavior: reducedMotion ? 'auto' : 'smooth' });
	});

	btnRight.addEventListener('click', () => {
		track.scrollBy({ left: getScrollDistance(), behavior: reducedMotion ? 'auto' : 'smooth' });
	});

	// Update when user scrolls with wheel/trackpad
	track.addEventListener('scroll', () => {
		updateButtons();
	});

	// Make wrapper focusable and support arrow keys
	wrapper.setAttribute('tabindex', '0');
	wrapper.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowRight') {
			track.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
			updateButtons();
		} else if (e.key === 'ArrowLeft') {
			track.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
			updateButtons();
		}
	});

	// init
	updateButtons();
});
