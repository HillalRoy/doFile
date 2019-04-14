let file, mainData;

window.onload = () => {
    const submit = $("#submit-file");
    file = $("#file");
    file.onchange = filein;
    submit.onclick = upload;
}
const filein = () => {
    if (file.files.length) {
        let l = file.files[0];
        let data = new FormData()
        data.append("file", l);
        data.append("user", "hillal");
        mainData = data;
    }
}
const upload = async () => {
    const url = "/api/upload";

    let up;

    const handleEvent = e => {
        switch (e.type) {
            case "loadstart":
                up = new uploading()
                break;
            case "progress":
                up.update(e.total, e.loaded)
                break;
            case "loadend":
                // Finished
                up.finished()
                break;
            default:
                // Error Handeling
                up.finished(e.type)
                break;
        }
    }

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('loadstart', handleEvent);
    xhr.upload.addEventListener('progress', handleEvent);
    xhr.addEventListener("loadend", handleEvent);
    xhr.addEventListener("error", handleEvent);
    xhr.addEventListener("abort", handleEvent);

    xhr.open("POST", url);
    xhr.send(mainData);
}

class uploading {

    constructor() {
        this.inputs = $(".inputs")
        this.uploading = $(".uploading")

        this.left = $(".amount .left")
        this.right = $(".amount .right")
        this.done = $(".progress .done")

        this.inputs.style.display = "none";
        this.uploading.style.display = "grid";

    }
    finished() {
        this.inputs.style.display = "block";
        this.uploading.style.display = "none";
    }
    update(total, loaded) {
        let parcentice = ((loaded / total) * 100) + "%";
        this.done.style.setProperty("--done", parcentice);
        this.left.innerText = loaded;
        this.right.innerText = total;
    }

}

