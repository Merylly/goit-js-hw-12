import{i as c,a as h,S as g}from"./assets/vendor-951421c8.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();const p="https://pixabay.com/api/",y="41929630-0ce2e4f7023522073d7143cb8",t={form:document.getElementById("form"),resultContainer:document.getElementById("result-container"),loader:document.querySelector(".loader"),loadMoreBtn:document.getElementById("load-more")},i={query:"",page:1,pageSize:40,maxPage:0};t.form.addEventListener("submit",L);async function L(a){a.preventDefault(),t.resultContainer.innerHTML="",i.page=1,t.loader.classList.remove("is-hidden"),t.loadMoreBtn.classList.add("is-hidden");const s=a.currentTarget;if(i.query=s.elements.picture.value.trim(),!i.query){t.loader.classList.add("is-hidden");return}try{const{hits:o,totalHits:e}=await d(i);o.length===0&&c.error({position:"topRight",message:"Sorry, there are no images matching your search query. Please try again!"}),i.maxPage=Math.ceil(e/i.pageSize),m(o),o.length>0&&o.length!==e&&(t.loadMoreBtn.classList.remove("is-hidden"),t.loadMoreBtn.addEventListener("click",n)),i.page===i.maxPage&&(t.loadMoreBtn.classList.add("is-hidden"),t.loadMoreBtn.removeEventListener("click",n),c.info({position:"topRight",message:"We're sorry, but you've reached the end of search results."}))}catch{c.error({position:"topRight",message:"Something wrong!"})}finally{s.reset(),t.loader.classList.add("is-hidden")}async function n(){i.page+=1,t.loadMoreBtn.disabled=!0,t.loader.classList.remove("is-hidden");try{const{hits:o}=await d(i);m(o),M()}catch{c.error({position:"topRight",message:"Something wrong!"})}finally{t.loadMoreBtn.disabled=!1,t.loader.classList.add("is-hidden")}i.page===i.maxPage&&(t.loadMoreBtn.classList.add("is-hidden"),t.loadMoreBtn.removeEventListener("click",n),c.info({position:"topRight",message:"We're sorry, but you've reached the end of search results."}))}}function d({query:a,page:s=1,pageSize:n}){return h.get(`${p}`,{params:{key:y,q:a,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:n,page:s}}).then(({data:o})=>o)}let B=new g(".gallery a",{captionsData:"alt",captionDelay:250});function m(a){const s=a.map(({webformatURL:n,largeImageURL:o,tags:e,likes:r,views:l,comments:u,downloads:f})=>`<li class="gallery-item">
            <a href="${o}">
  <img class="gallery-image" src="${n}" alt="${e}" width="370" heigth="300"></a>
  <ul class="info-list">
    <li class="info-item">Likes: ${r}</li>
    <li class="info-item">Views: ${l}</li>
    <li class="info-item">Comments: ${u}</li>
    <li class="info-item">Downloads: ${f}</li>
  </ul>
</li>`).join("");t.resultContainer.insertAdjacentHTML("beforeend",s),B.refresh()}function M(){if(i.page>1){const a=document.querySelector(".gallery-item").getBoundingClientRect();window.scrollBy({top:a.height*2,left:0,behavior:"smooth"})}}
//# sourceMappingURL=commonHelpers.js.map
