<?php
// This file is generated. Do not modify it manually.
return array(
	'local-time-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/local-time-block',
		'version' => '0.1.0',
		'title' => 'Local Time Block',
		'category' => 'widgets',
		'icon' => 'clock',
		'description' => 'Block for displaying local time.',
		'attributes' => array(
			'align' => array(
				'type' => 'string',
				'default' => 'wide'
			),
			'cardBgColor' => array(
				'type' => 'string',
				'default' => '#e3e3e3'
			),
			'cardFontColor' => array(
				'type' => 'string',
				'default' => '#0d3ca1'
			),
			'gradientColorLeft' => array(
				'type' => 'string',
				'default' => '#0000FF'
			),
			'gradientColorRight' => array(
				'type' => 'string',
				'default' => '#FFA500'
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'align' => array(
				'wide',
				'full'
			),
			'html' => false
		),
		'usesContext' => array(
			
		),
		'textdomain' => 'local-time-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
