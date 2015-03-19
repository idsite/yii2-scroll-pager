<?php

namespace idsite\scrollPager;

use yii\web\AssetBundle;

class Asset extends AssetBundle {

    public $sourcePath;
    public $js = [
        'scroll-pagination.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];

    public function init() {

        $this->sourcePath = __DIR__ . '/assets';
        parent::init();
    }

}
