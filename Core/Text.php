<?php

namespace Core;

class Text {
    public static function normalize($category)
    {
        $stripped = static::removeSpaces($category);
        $lower = static::toLower($stripped);
        return $lower;
    }

    public static function removeSpaces($category)
    {
        $stripped = str_replace(" ", "", $category);
        return $stripped;
    }

    public static function  toLower($category)
    {
        $lower = strtolower($category);
        return $lower;
    }
}

?>