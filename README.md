Автоматическая Ajax пагинация при скролле страницы
==========================================
описание

Installation
------------

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```
php composer.phar require --prefer-dist idsite/yii2-scroll-pager "*"
```

or add

```
"idsite/yii2-scroll-pager": "*"
```

to the require section of your `composer.json` file.


Usage
-----



нужно вручную добавить условие на фильтрацию по ИДшникам, которые передаються по умолчанию в GET или POST параметре "notid".
и установить limit на запрос. так как pagination не используется

```php
if ($ids = Yii::$app->getRequest()->post('notid',Yii::$app->getRequest()->getQueryParam('notid'))) {
            $ids = array_map(function($v) {
                return (int) $v;
            }, explode('-', $ids));
            if ($ids) {
                return "AND city.id NOT IN (" . implode(',', $ids) . ")";
}
}
```
или если сортировка по айдишнику можно так
```php
if ($ids = Yii::$app->getRequest()->post('notid',Yii::$app->getRequest()->getQueryParam('notid'))) {
            if ($ids = explode('-', $ids)) {
                $query->andWhere('id<:lid',[':lid'=>array_pop($ids)]);
            }
        }
```