jQuery(document).ready(() => {
  jQuery('.zoteroxy').each(function() {
    const endpoint = jQuery(this).data('endpoint');
    initZoteroxy(endpoint, this);
  });
});

// TODO: localizations

function initZoteroxy(endpoint, $elem) {
  const loader = jQuery('<div>').addClass('zoteroxy-loader');
  jQuery($elem).append(loader);
  console.log("INIT");
  jQuery.ajax({
    url: `${endpoint}/items`,
    type: 'GET',
    dataType: 'json',
    headers: {'Accept': 'application/json'},
    success: function(data) {
      loader.remove();
      jQuery($elem).append(processItems(endpoint, data));
    }
  });
}

function processItems(endpoint, data) {
  console.log('ITEMS');
  console.log(data);
  const lst = jQuery('<ul>');
  data.forEach(item => {
    // TODO: multiple information, formatting
    // TODO: various styles (?)
    const authors = processAuthors(item.authors);
    const title = jQuery('<span>').addClass('zoteroxy-item-title').text(item.title);

    const lstItem = jQuery('<li>').append(authors).append(': ');

    if (item.attachments.length > 0) {
      // TODO: handle multiple attachments
      const href = `${endpoint}/file/${item.attachments[0].key}`;
      const attachmentLink = jQuery('<a>').addClass('zoteroxy-attachment-link').attr('href', href).attr('target', '_blank');
      lstItem.append(attachmentLink.append(title));
    } else {
      lstItem.append(title);
    }

    lst.append(lstItem);
  });
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
