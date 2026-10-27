# Changing presidential candidate photos

You can change **every candidate's image without editing any page components**.

## Recommended method (one command)

1. Put the candidate photo (JPEG, PNG or WebP) on your PC.
2. Open a terminal inside this project folder.
3. List candidate photo names: `npm run photo:list`
4. Replace one picture, for example:

   `npm run photo:set -- bola-ahmed-tinubu "C:\Users\YourName\Pictures\tinubu.jpg"`

   macOS/Linux: `npm run photo:set -- bola-ahmed-tinubu ./pictures/tinubu.jpg`

5. Rebuild and redeploy the website. The new photograph updates the candidate directory, profile pages, homepage highlights and community-poll cards automatically. No database migration is necessary.

The command copies the image to `public/candidate-photos/` and updates **`data/candidate-photos.json`**, which is the central image map for all candidates. Supported images: `.jpg`, `.jpeg`, `.png`, `.webp`; maximum 8 MB per file.

## Manual method

Copy an image into `public/candidate-photos/` then edit the matching line in `data/candidate-photos.json` to its path, for example:

`"peter-gregory-obi": "/candidate-photos/peter-gregory-obi.jpg"`

Or paste a trusted photo URL in the JSON value. Set the value to `null` if you want the Nigerian flag placeholder. Existing Wikimedia Commons sources for four candidates are retained in the default map.

**Important:** these are source-code updates. On Dokploy the images must be added to your Git repository or redeployed inside the new ZIP, not uploaded manually into a running container (which can lose them on redeployment). A public photo-upload endpoint has intentionally not been added because anyone could deface candidate portraits without an authenticated admin panel.

## Candidate photo names

| Candidate | Photo slug |
|---|---|
| Rufai Adekunle Omo-Aje (AA) | `rufai-adekunle-omo-aje` |
| Abbas-Bin Aliyu (ADP) | `abbas-bin-aliyu` |
| Yusuf Kabiru (APP) | `yusuf-kabiru` |
| Omoyele Sowore (AAC) | `omoyele-sowore` |
| Atiku Abubakar (ADC) | `atiku-abubakar` |
| Bola Ahmed Tinubu (APC) | `bola-ahmed-tinubu` |
| Oluseyi Abiodun Makinde (APM) | `oluseyi-abiodun-makinde` |
| Sunday Adenuga (BP) | `sunday-adenuga` |
| Moses Olusoji Adebisi (DLA) | `moses-olusoji-adebisi` |
| Sunday Chibuzo Okereke (LP) | `sunday-chibuzo-okereke` |
| Ada Elizabeth Fredrick Okwori (NDP) | `ada-elizabeth-fredrick-okwori` |
| Nkem Esther Okereke (NRM) | `nkem-esther-okereke` |
| Peter Gregory Obi (NDC) | `peter-gregory-obi` |
| Sandy Ojang Onor (PDP) | `sandy-ojang-onor` |
| Donald Duke (PRP) | `donald-duke` |
| Adewole Ebenezer Adebayo (SDP) | `adewole-ebenezer-adebayo` |
| Peter Ada Agada (YPP) | `peter-ada-agada` |
| Daniel Daberechukwu Nwanyanwu (ZLP) | `daniel-daberechukwu-nwanyanwu` |

Use photographs with permission or suitable reuse licenses and give credit in `IMAGE-SOURCES.md` and/or `/credits`. Avoid misleading crops or alterations. After changing a public photo, clear browser caches if an old copy remains visible. You can use a descriptive unique filename before running the update command to make cache invalidation easier.
