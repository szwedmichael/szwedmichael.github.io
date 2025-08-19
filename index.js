// Lightweight site interactions for Sugarlytics homepage

document.addEventListener('DOMContentLoaded', () => {
  // Sticky header background toggle
  const header = document.getElementById('site-header')
  const applyHeaderStyle = () => {
    if (!header) return
    const isScrolled = window.scrollY > 10
    header.classList.toggle('bg-white/80', isScrolled)
    header.classList.toggle('backdrop-blur', isScrolled)
    header.classList.toggle('shadow-sm', isScrolled)
    header.classList.toggle('border-b', isScrolled)
    header.classList.toggle('border-gray-200', isScrolled)
  }
  applyHeaderStyle()
  window.addEventListener('scroll', applyHeaderStyle)

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button')
  const mobileMenu = document.getElementById('mobile-menu')
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden')
      mobileMenu.classList.toggle('hidden', !isHidden)
      mobileMenuButton.setAttribute('aria-expanded', String(isHidden))
    })
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = (anchor.getAttribute('href') || '').substring(1)
      if (!targetId) return
      const targetEl = document.getElementById(targetId)
      if (!targetEl) return
      e.preventDefault()
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden')
        mobileMenuButton?.setAttribute('aria-expanded', 'false')
      }
    })
  })

  // Blog: load latest three posts
  const blogContainer = document.getElementById('blog-cards')
  if (blogContainer && blogContainer.getAttribute('data-disabled') !== 'true') {
    fetch('assets/blog/posts.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : [])
      .then((posts) => {
        if (!Array.isArray(posts)) return
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))
        const top = posts.slice(0, 3)
        blogContainer.innerHTML = ''
        top.forEach(post => {
          const card = document.createElement('article')
          card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          const hasThumb = post.thumbnail && typeof post.thumbnail === 'string'
          card.innerHTML = `
            ${hasThumb ? `<img src="${post.thumbnail}" alt="${post.title}" class="w-full h-40 object-cover" />` : ''}
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">${post.title}</h3>
              <p class="text-gray-600 mb-4">${post.snippet}</p>
              <a class="text-pink-600 font-medium hover:underline" href="${post.url}" aria-label="Read more: ${post.title}">Read More →</a>
            </div>
          `
          blogContainer.appendChild(card)
        })
      })
      .catch(() => {
        // leave any static fallback content
      })
  }
})