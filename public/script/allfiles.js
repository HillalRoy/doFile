let current = [];
const song = new MusicPlayer();
let promised = [];

window.onload = setup;

function setup() {
  $("#music-player-replasement").style.height = `${
    $("#music-player").getBoundingClientRect().height
  }px`;
  $("#music-player-replasement").style.width = `${
    $("#music-player").getBoundingClientRect().width
  }px`;
  let pathname = location.pathname;

  current = pathname
    .split("/")
    .filter(a => (a !== "explor") & (a !== "") & (a !== "control"));

  dataFetch("");
}

const dataloadImg = async (el, name) => {
  const json = { path: `${current.join("/")}/${name}` };

  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  };

  try {
    const res = await fetch("/file/img/", option);
    const jsonBuf = await res.json();
    const bolb = new Blob([new Uint8Array(jsonBuf.buf.data)], {
      type: jsonBuf.format
    });
    const url = URL.createObjectURL(bolb);
    el.parentNode.style.background = "none";
    el.src = url;
  } catch (err) {}
  return Promise.resolve();
};

const dataFetch = link => {
  let json = { path: `${current.join("/")}/${link}` };

  const fetchData = async () => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    };

    const data = await fetch(`/file/allfiles`, option);
    const jsonData = await data.json();
    if (jsonData.type === "file not found") {
      // return window.location.replace("/404");
      return alert(option);
    }
    return jsonData;
  };

  fetchData()
    .then(json => {
      let t = 50;
      $("#files").innerHTML = ``;

      current.push(`${link}`);
      const preFixed = `http://${location.hostname}:6655/${current.join("/")}`;

      song.songList = json.musics;
      song.preFixed = preFixed;

      for (files in json) {
        json[files].forEach(a => {
          addFile(files, a, t);
          t += 20;
        });
      }

      async function asyncronce(promised) {
        for (let i = 0; i < promised.length; i += 5) {
          const arrof = [];

          for (let j = 0; j < 5; j++)
            if (promised[i + j]) arrof.push(promised[i + j]);

          await Promise.all(arrof.map(img => dataloadImg(img[0], img[1])));
        }
      }
      mapItems();
      asyncronce(promised);
    })
    .catch(err => {
      let sections = document.querySelectorAll("section");
      sections.forEach(el => (el.style.display = "none"));
    });
};

function addFile(type, name, t) {
  const files = $("#files");
  const fragment = document.createDocumentFragment();
  const a = document.createElement("a");
  a.href = `#${name}`;
  a.style.setProperty("--dely", t);
  a.setAttribute("onclick", `openLink('${name}', '${type}')`);
  a.classList.add(type);

  if (type === "photos") {
    const path = `/file/imgthamp${current.join("/")}/` + name;
    a.innerHTML = ` <div class="icon"><img src="${path}"></div>`;
  } else {
    a.innerHTML = ` <div class="icon"></div>`;
  }

  a.innerHTML += `<div class="name">
                        ${name.length > 10 ? name.substring(0, 8) + ".." : name}
                    </div>`;

  fragment.appendChild(a);
  files.appendChild(fragment);

  if (type === "musics") {
    const img = new Image();
    promised.push([img, name]);

    if (img) a.querySelector(".icon").appendChild(img);
  }
}

const closeImg = () => {
  const imgView = $(".imgview");
  const load = $(".imgview .load");
  imgView.style.display = `none`;

  if ($(".imgview img")) imgView.removeChild($(".imgview img"));

  load.style.display = `block`;
  imgView.style.height = "60vh";
};

