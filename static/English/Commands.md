# Commands

## ``npm run backup``

Generate a ``backup.json`` file that stores the metadata (filename, file created date and file modified date) of all the files in the ``static`` directory. Should be used with the ``npm run restore``.

## ``npm run build``

Traverse the ``static`` directory, generate the file indexing files in the ``.index`` directory. If the RSS feature is enabled, will generate ``rss.xml`` file and server side rendered HTML files for the newests articles.

## ``npm run compress``

Build the front-end source code with rollup. The configuration file for rollup is at ``builder/rollup.config.js``.

## ``npm run count``

Count the word count information for all the articles, generate the ``count.html`` file in the root directory.

## ``npm run preview``

Start the preview server with the port defined in the ``previewPort`` field in the configuration file, the address for localhost and LAN will be given.

## ``npm run restore``

Read the ``backup.json`` file in the root directory to restore data. Should be used with ``npm run backup`` command.

## ``npm run test``

Run the test cases in the ``builder/test`` directory.
