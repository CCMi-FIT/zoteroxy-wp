<?php
/*
Plugin Name: Zoteroxy WP Integration
Plugin URI: https://github.com/CCMi-FIT/zoteroxy-wp
Description: Plugin for integrating simply Zoteroxy into WordPress
Version: 1.0.0
Author: Marek Suchánek
Author URI: http://github.com/MarekSuchanek
License: MIT
*/
define('ZoteroxyWP', true);

function ZoteroxyWP_install() {

}
register_activation_hook(__FILE__, 'ZoteroxyWP_install');

function ZoteroxyWP_uninstall() {

}
register_deactivation_hook(__FILE__, 'ZoteroxyWP_uninstall');

function ZoteroxyWP_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_style('ZoteroxyWP_style', plugin_dir_url(__FILE__).'style.css');
    wp_enqueue_script('ZoteroxyWP_script', plugin_dir_url(__FILE__).'script.js');
}
add_action('wp_enqueue_scripts', 'ZoteroxyWP_scripts');

function ZoteroxyWP_shortcode($attrs) {
    $endpoint = $attrs['endpoint'];
    $lang = empty($attrs['lang']) ? 'en' : $attrs['lang'];
    return "<div class=\"zoteroxy\" data-endpoint=\"$endpoint\" data-lang=\"$lang\"></div>";
}
add_shortcode('zoteroxy', 'ZoteroxyWP_shortcode');

