//header animations
let profile = document.querySelector('.header .flex .prof');

document.querySelector('#user-btn').onclick = () =>{
    profile.classList.toggle('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    profile.classList.remove('active');
    searchForm.classList.remove('active');
}

//view topics button
const viewTopicsButtons = document.querySelectorAll('.inline-btn');

viewTopicsButtons.forEach(button => {
  button.addEventListener('click', function () {
    const subjectId = this.getAttribute('data-subjects-id');
    window.location.href = `/topic/${subjectId}`;
  });
});