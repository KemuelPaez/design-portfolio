document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(a=>{
	a.addEventListener('click', e=>{
		const href = a.getAttribute('href');
		if(href.length>1){
		e.preventDefault();
		const el = document.querySelector(href);
		if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
		}
	});
});

// Typewriter effect for the header name and titles
function typeWriter(el, text, speed = 120) {
	let i = 0;
	el.textContent = '';
	const timer = setInterval(() => {
		el.textContent += text.charAt(i);
		i++;
		if (i >= text.length) {
			clearInterval(timer);
		}
	}, speed);
}

const twName = document.getElementById('typewriter-name');
const twTitles = document.getElementById('typewriter-titles');
if (twName && twTitles) {
	const name = twName.getAttribute('data-name') || 'Your Name';
	const titles = twTitles.getAttribute('data-titles') || '';
	setTimeout(() => {
		typeWriter(twName, name, 60);
		setTimeout(() => typeWriter(twTitles, titles, 30), name.length * 50 + 200);
	}, 600);
}

// Scroll-triggered fade-in animations
const observerOptions = {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const fadeIns = entry.target.querySelectorAll('.fade-in');
			fadeIns.forEach(el => el.classList.add('visible'));
		}
	});
}, observerOptions);

// Observe each section
const sections = document.querySelectorAll('section');
sections.forEach(section => {
	observer.observe(section);
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const modalNav = document.getElementById('modal-nav');
const closeModal = document.getElementById('close-modal');

if (hamburger && modalNav) {
	hamburger.addEventListener('click', () => {
		modalNav.classList.add('active');
	});

	// Close modal when clicking close button
	if (closeModal) {
		closeModal.addEventListener('click', () => {
			modalNav.classList.remove('active');
		});
	}

	// Close modal when clicking outside content
	modalNav.addEventListener('click', (e) => {
		if (e.target === modalNav) {
			modalNav.classList.remove('active');
		}
	});

	// Close modal when clicking a link
	modalNav.addEventListener('click', (e) => {
		if (e.target.tagName === 'A') {
			modalNav.classList.remove('active');
		}
	});
}

// Ad modal functionality
const adModal = document.getElementById('adModal');
const modalImage = document.getElementById('modalImage');

if (adModal && modalImage) {
	adModal.addEventListener('show.bs.modal', (event) => {
		const button = event.relatedTarget;
		const imgSrc = button.getAttribute('data-img');
		modalImage.src = imgSrc;
	});
}
