let playlist = [];
let currentVideoIndex = 0;

function updateVideo() {
    const url = document.getElementById("youtube-url").value;
    const videoId = extractVideoId(url);
    if (videoId) {
        const iframe = document.getElementById("youtube-player");
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else {
        alert("Please enter a valid YouTube URL.");
    }
}

async function searchYouTube() {
    const query = document.getElementById("search-query").value;
    const apiKey = "AIzaSyDM6shPGutLxg1C69BiIzgRooP3bydwKYg"; // แทน YOUR_API_KEY ด้วย API Key ของคุณ
    const maxResults = 7; // จำนวนผลลัพธ์สูงสุดที่ต้องการแสดง

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${query}&key=${apiKey}&part=snippet&maxResults=${maxResults}`);
    const data = await response.json();

    displayResults(data.items);
}

function displayResults(videos) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; // เคลียร์ผลลัพธ์ก่อนที่จะแสดงผลใหม่

    videos.forEach(video => {
        const title = video.snippet.title;
        const thumbnailUrl = video.snippet.thumbnails.default.url;
        const videoId = video.id.videoId;

        const resultItem = document.createElement("div");
        resultItem.innerHTML = `
            <h3 class="text-se">${title}</h3>
            <img src="${thumbnailUrl}" alt="${title}" onclick="copyLink('${videoId}')">
        `;
        resultsContainer.appendChild(resultItem);
    });
}

function addToPlaylist() {
    const url = document.getElementById("youtube-url").value;
    const videoId = extractVideoId(url);
    if (videoId) {
        playlist.push(videoId);
        displayPlaylist(); // เรียกใช้ฟังก์ชันเพื่อแสดงรายการเพลย์ลิสต์
        alert("Video added to playlist!");
    } else {
        alert("Please enter a valid YouTube URL.");
    }
}

function playNextVideo() {
    const iframe = document.getElementById("youtube-player");
    if (currentVideoIndex < playlist.length) {
        iframe.src = `https://www.youtube.com/embed/${playlist[currentVideoIndex]}?autoplay=1`;
        iframe.style.display = "block"; // แสดงวิดีโอที่เปลี่ยนแปลง
        currentVideoIndex++;
    } else {
        alert("End of playlist.");
    }
}

function displayPlaylist() {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = ""; // เคลียร์รายการเพลย์ลิสต์ก่อนที่จะแสดง
    playlist.forEach((videoId, index) => {
        const clipContainer = document.createElement("div");
        clipContainer.classList.add("clip");

        const thumbnail = document.createElement("img");
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        thumbnail.alt = `Thumbnail ${index + 1}`;

        const clipName = document.createElement("span");
        clipName.textContent = `Clip ${index + 1}`;

        clipContainer.appendChild(thumbnail);
        clipContainer.appendChild(clipName);
        playlistContainer.appendChild(clipContainer);
    });
}

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function copyLink(videoId) {
    const link = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(link)
        .then(() => alert("Link copied to clipboard: " + link))
        .catch(error => console.error("Unable to copy link: ", error));
}

function clearResults() {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; // เคลียร์ผลลัพธ์ทั้งหมดที่แสดง
}
