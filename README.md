# zoteroxy-wp

WordPress plugin for displaying results provided by [Zoteroxy API]()

## Installation

You can install this WordPress plugin simply by placing the `zoteroxy-wp` directory
to your `<wordpress>/wp-content/plugins` directory. Then activate this plugin
in the WordPress administration.

If you do not have access to the `plugins` directory, create a ZIP package with
`zoteroxy-wp` and upload it using WordPress administration interface.

## Usage

This plugin uses so-called *shortcode*:

```
[zoteroxy endpoint="..." lang="..."]
```

You can simply put this into your WordPress page (or post) wherever you need to.

The arguments are:

* `endpoint` = base URL of the used [Zoteroxy API]() instance, e.g. `https://my.zoteroxy.tld`
* `lang` = optional language, currently supported: `en` (default), `cs`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE)
file for more details
