// Name: Ahmad Salahuddin bin Mazlan | Matric: DX242569SPDJ04
// Mobile navigation - plain JavaScript (no server required).
const menuButton = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileNav.hidden = isOpen;
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}
