

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  setTimeout(() => {
    const burger = document.querySelector<HTMLDivElement>('.menu-burger');
    console.log(burger);
    if (burger) {
      burger.addEventListener('click', () => {
        console.log('clicked');
        const links = document.querySelector('.links');
        links?.classList.toggle('open');
      });
    }
  }, 3000); // Délai de 1 seconde
});
