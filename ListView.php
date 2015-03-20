<?php

namespace idsite\scrollPager;
use yii\base\InvalidConfigException;
use Yii;

class ListView extends \yii\widgets\ListView {

    /**
     * название get параметра с ИДшниками
     * @var string 
     */
    public $nameParam = 'notid';

    /**
     * ключ в модели, который использовать в качесвте первичного ключа, если не указано возметься из pk
     * @var string 
     */
    public $keyId;
    public $scriptOptions = [];

    public function init() {
        parent::init();

        if ($this->itemView === null) {
            throw new InvalidConfigException('The "itemView" property must be set.');
        }

        if ($this->nameParam === null) {
            throw new InvalidConfigException('The "nameParam" property must be set.');
        }


        Asset::register($this->view);
    }

    public function run() {
        if ($this->dataProvider->getPagination()) {
            if (\Yii::$app->getRequest()->headers->has('X-SCROLL-PAGER')) {
                Yii::$app->getResponse()->clearOutputBuffers();
                echo $this->renderItems();
                Yii::$app->end();
            }

            $params = array_merge(['pageSize' => $this->dataProvider->getPagination()->pageSize, 'nameParam' => $this->nameParam], $this->scriptOptions);

            $this->view->registerJs('$("#' . $this->options['id'] . '").scrollPagination(' . \yii\helpers\Json::encode($params) . ')');
        }

        parent::run();
    }

}
