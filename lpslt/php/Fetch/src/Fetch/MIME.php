<?php

/*
 * This file is part of the Fetch package.
 *
 * (c) Robert Hafner <tedivm@tedivm.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fetch;

/**
 * This library is a wrapper around the Imap library functions included in php.
 *
 * @package Fetch
 * @author  Robert Hafner <tedivm@tedivm.com>
 * @author  Sergey Linnik <linniksa@gmail.com>
 */
final class MIME
{
    /**
     * @param string $text
     * @param string $targetCharset
     *
     * @return string
     */
    public static function decode($text, $targetCharset = 'UTF-8')
    {
        if (null === $text) {
            return null;
        }

        $result = '';

        foreach (imap_mime_header_decode($text) as $word) {
            $ch = 'default' === $word->charset ? 'ascii' : $word->charset;
            if ($ch==="ascii" && ($c=strtoupper(mb_detect_encoding($word->text)))!==strtoupper($ch)) {
            	$ch=$c;
            }
            $result .= iconv($ch, $targetCharset."//IGNORE", $word->text);
        }

        return $result;
    }
}
