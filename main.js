'esversion: 6';

function fetchData() {
    d3.json('pages/index.json').then(pagesIndex => {
        const pagePromises = [];
        pagesIndex.sites.forEach(site => {
            const pagePromise = new Promise((resolve, reject) => {
                d3.json('pages/' + site + '.json').then(
                    pageData => resolve(pageData),
                    err => resolve(null)
                );
            });
            pagePromises.push(pagePromise);
        });
        return Promise.all(pagePromises);
    }).then(pages => pages.filter(page => page != null))
    .then(renderPages);
}

function renderPages(pages) {
    console.log(pages);
    const mainSelection = d3.select('.main');
    const pagesSelection = mainSelection.selectAll('article').data(pages);
    pagesSelection.join(
        enter => {
            const card = enter.append('div').classed('card', true);
            card.append('img').classed('card-image', true);
            const content = card.append('div').classed('card-content', true);
            content.append('a').classed('card-link', true).append('h2');
            content.append('section');
            return card;
        }
    ).call(page => {
        page.select('.card-image').attr('src', d => {
            if (d.image == null) {
                return null;
            }
            return './pages/' + d.image;
        }).style('background-color', d => {
            if (d.imageBackground == null) {
                return null;
            }
            return d.imageBackground;
        });
        page.select('a').attr('href', d => d.url);
        page.select('h2').text(d => d.title);
        page.select('section').text(d => d.description);
    });
}

fetchData();
