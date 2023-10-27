<?php

namespace Core;

/**
 * View
 */
class View {

    /**
     * Render a view file
     * @param string $view The view file
     * @return void
     */
    public static function render($view, $args = []) {

        extract($args, EXTR_SKIP);

        $file = '../App/Views/'.$view; // relative to Core directory

        if (is_readable($file)){
            require $file;
        } else {
            throw new \Exception('$file not found');
        }

    }

    /**
     * Render page with templating engine
     * @param mixed $template
     * @param mixed $args
     * @return void
     */
    public static function renderTemplate($template, $args = [])
    {
        echo static::getTemplate($template, $args);
    }

    /**
     * Get the contents of the template using Twig
     * @param string $template The template file
     * @param array $args Associative array of data to display in the view (optional)
     * @return string
     */
    public static function getTemplate($template, $args = [])
    {
        static $twig = null;
 
        if ($twig === null)
        {
            $loader = new \Twig\Loader\FilesystemLoader('../App/Views');
            $twig = new \Twig\Environment($loader);
            $twig->addGlobal('current_user', \App\Auth::getUser());
            $twig->addGlobal('flash_messages', \App\Flash::getMessage());
            $twig->addGlobal('current_date', Date('Y-m-d'));
            if (isset($_SESSION['user_id'])) {
                $twig->addGlobal('expenses_categories', \App\Models\ExpenseCategory::getExpenseCategoriesByUserId($_SESSION['user_id']));
                $twig->addGlobal('incomes_categories', \App\Models\IncomeCategory::getIncomeCategoriesByUserId($_SESSION['user_id']));
                $twig->addGlobal('payment_methods', \App\Models\PaymentMethod::getPaymentMethodsByUserId($_SESSION['user_id']));
            }
        }
 
        return $twig->render($template, $args);
    }

}