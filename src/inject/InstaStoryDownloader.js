const DOWNLOAD_IMG_URL = "https://i.imgur.com/dmt8sIL.png";
const DOWNLOAD_BUTTON_CLASS = "downloadButton";
const BUTTON_DIV_CLASS = "_2tt3z";
const STORY_IMG_CLASS = "_ro0gg";
const STORY_VIDEO_CLASS = "_6kyf0";

class InstaStoryDownloader {
    constructor() {
        //
    }

    apply() {
        addEventListener("DOMNodeInserted", (e) =>{
            let isStory = e.srcElement.classList.contains(STORY_IMG_CLASS) || e.srcElement.classList.contains(STORY_VIDEO_CLASS);
            if(e.srcElement && isStory)
                this.insertDownloadButton();
        });
    }

    /**
     * Inserts a download button to the document that the user can use.
     */
    insertDownloadButton() {
        // Check if there's a place to add the button to
        let div = document.getElementsByClassName(BUTTON_DIV_CLASS)[0];
        if (!div) return;
        console.log(div);

        // Create the download button
        let downloadButton = document.createElement('button');
        downloadButton.classList.add(DOWNLOAD_BUTTON_CLASS);
        downloadButton.style.backgroundImage = `url(${DOWNLOAD_IMG_URL});`;
        downloadButton.addEventListener("click", (e) => this.downloadCurrentStory());

        // Add the button to the document
        div.insertBefore(downloadButton, div.firstChild);
    }

    /**
     * Downloads the currents story media using chrome's API
     */
    downloadCurrentStory() {
        let downloadUrl = this.getStoryLink();
        let randomFileName = Math.random().toString(36).substring(2);
        let format = downloadUrl.split(".").reverse()[0];
        chrome.downloads.download({
            url: downloadUrl,
            filename: `${randomFileName}.${format}`
        });
    }

    /**
     * @returns {string} The link to download the story media
     */
    getStoryLink() {
        // Try to find imgs in the current story
        let imgs = document.getElementsByClassName(STORY_IMG_CLASS);
        if (!imgs || imgs.length == 0) {
            // Try to find videos in the current story
            let videos = document.getElementsByClassName(STORY_VIDEO_CLASS);
            if (!videos || videos.length == 0)
                return null;

            return videos[0].currentSrc;
        }
        return imgs[0].currentSrc;
    }
}