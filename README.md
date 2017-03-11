# Github Scraper
### A nodejs script (using cheerio module) to extract github users information and save to json file. 

###### How to execute this script?
1. To execute this script you must have nodejs installed.
2. Download zip file (or make git clone) and extract to hard disk
3. Open terminal/cmd
4. Move to script directory (where you extracted zip file) using `cd /path/to/repository`
5. Run `npm install` to install all nodejs dependencies
6. Once all the dependencies has been installed type `node index.js <url>`
7. Replace <url> with url of github user (of which you want to extract information) e.g. https://github.com/varunon9
8. Depending on your internet speed it will take some time. You can see output on screen once finished.
9. script also write this data to hard-disk. Check user.json file in this directory.
10. You will have to beautify json data to make it readable. You can visit https://jsonformatter.curiousconcept.com/
11. You can check data-beautify.json which is extracted data after beautification.