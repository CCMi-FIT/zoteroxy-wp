jQuery(document).ready(() => {
  jQuery('.zoteroxy').each(function() {
    const endpoint = jQuery(this).data('endpoint');
    const lang = jQuery(this).data('lang');
    initZoteroxy(endpoint, lang, this);
  });
});

function zoteroxyLang(lang) {
  if (lang == 'cs') {
    return {
      pages: 'str.',
      volume: 'sv.',
      issue: 'č.',
      link: 'Odkaz',
      read: 'Číst',
    };
  } else {
    return {
      pages: 'pp.',
      volume: 'vol.',
      issue: 'n.',
      link: 'Link',
      read: 'Read',
    };
  }
}

function initZoteroxy(endpoint, lang, $elem) {
  const loader = jQuery('<div>').addClass('zoteroxy-loader');
  jQuery($elem).append(loader);
  jQuery.ajax({
    url: `${endpoint}/collection`,
    type: 'GET',
    dataType: 'json',
    headers: {'Accept': 'application/json'},
    success: function(data) {
      loader.remove();
      jQuery($elem).append(processItems(endpoint, data, lang));
    }
  });
}

function processItems(endpoint, data, lang) {
  const strings = zoteroxyLang(lang);
  console.log('Received data from Zoteroxy');
  console.log(data);
  console.log('Rendering ...');
  const lst = jQuery('<ul>');
  data.items.sort(
    (a, b) => {
      if (a.year && b.year) {
        return parseInt(b.year) - parseInt(a.year);
      } else if (a.year) {
        return -1;
      } else if (b.year) {
        return 1;
      } else return 0;
    }
  );
  data.items.forEach(item => {
    const authors = processAuthors(item.authors);
    const title = jQuery('<span>')
      .addClass('zoteroxy-item-title')
      .text(item.title);

    const lstItem = jQuery('<li>').append(authors);

    if (item.year) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-year')
          .text(` (${item.year})`)
      )
    }

    lstItem
      .append('. ')
      .append(title)
      .append('. ');

    if (item.proceedingsTitle) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-proceedings')
          .text(`${item.proceedingsTitle}`)
      );
      if (item.volume) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-volume')
            .text(` ${strings.volume} ${item.volume}`)
        );
      }
      if (item.issue) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-issue')
            .text(` ${strings.issue} ${item.issue}`)
        );
      } 
      if (item.pages) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-pages')
            .text(` (${strings.pages} ${item.pages})`)
        );
      } 
      lstItem.append('. ');
    } else if (item.publicationTitle) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-publication')
          .text(`${item.publicationTitle}`)
      );
      if (item.volume) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-volume')
            .text(` ${strings.volume} ${item.volume}`)
        );
      }
      if (item.issue) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-issue')
            .text(` ${strings.issue} ${item.issue}`)
        );
      } 
      if (item.pages) {
        lstItem.append(
          jQuery('<span>')
            .addClass('zoteroxy-item-pages')
            .text(` (${strings.pages} ${item.pages})`)
        );
      } 
      lstItem.append('. ');
    }

    if (item.publisher) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-publisher')
          .text(`${item.publisher}`)
      );
      lstItem.append('. ');
    }

    if (item.isbn) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-isbn')
          .text(`ISBN: ${item.isbn}`)
      );
      lstItem.append('. ');
    }

    if (item.issn) {
      lstItem.append(
        jQuery('<span>')
          .addClass('zoteroxy-item-issn')
          .text(`ISSN: ${item.issn}`)
      );
      lstItem.append('. ');
    }

    const actions = jQuery('<div>').addClass('zoteroxy-item-actions');
    const bibtexid = `zoteroxy-bibtex-${item.key}`;
    actions.append(
      jQuery('<a>')
        .addClass('zoteroxy-button-bibtex')
        .text('BibTeX')
        .click(function() {
          jQuery(this).toggleClass('open');
          jQuery(`#${bibtexid}`).toggleClass('zoteroxy-hidden');
        })
    ).append(' ');

    if (item.doi) {
      const href = item.doi.startsWith('10.') ? `https://doi.org/${item.doi}` : item.doi;
      actions.append(
        jQuery('<a>')
          .attr('href', href)
          .attr('target', '_blank')
          .text('DOI')
      ).append(' ');
    }
    if (item.url) {
      actions.append(
        jQuery('<a>')
          .attr('href', item.url)
          .attr('target', '_blank')
          .text(`${strings.link}`)
      ).append(' ');
    }

    item.attachments.forEach(attachment => {
      const href = `${endpoint}/file/${attachment.key}`;
      const title = `Attachment: ${attachment.filename}`;
      actions.append(
        jQuery('<a>')
          .addClass('zoteroxy-attachment')
          .attr('href', href)
          .attr('target', '_blank')
          .attr('title', title)
          .text(`${strings.read}`)
      ).append(' ');
    });

    lstItem.append(actions);
    lstItem.append(
      jQuery('<pre>')
        .addClass('zoteroxy-item-bibtex')
        .addClass('zoteroxy-hidden')
        .attr('id', bibtexid)
        .append(item.bibtex)
    );

    lst.append(lstItem);
  });
  console.log('Rendering done');
  return lst;
}


function processAuthors(authors) {
  const result = jQuery('<span>').addClass('zoteroxy-item-authors');
  if (authors.length == 0) {
    return null;
  } else if (authors.length == 1) {
    const author = authors[0];
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author.lastname}, ${author.firstname}`)
    );
  } else if (authors.length == 2) {
    const author1 = authors[0];
    const author2 = authors[1];
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author1.lastname}, ${author1.firstname}`)
    );
    result.append(' and ');
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author2.lastname}, ${author2.firstname}`)
    );
  } else if (authors.length == 3) {
    const author1 = authors[0];
    const author2 = authors[1];
    const author3 = authors[2];
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author1.lastname}, ${author1.firstname}`)
    );
    result.append('; ');
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author2.lastname}, ${author2.firstname}`)
    );
    result.append(' and ');
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author3.lastname}, ${author3.firstname}`)
    );
  } else {
    const author = authors[0];
    result.append(
      jQuery('<span>').addClass('zoteroxy-item-author').text(`${author.lastname}, ${author.firstname} et al.`)
    );
  }
  return result;
}
