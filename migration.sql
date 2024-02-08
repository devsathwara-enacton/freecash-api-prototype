ALTER TABLE `offerwall_networks` ADD INDEX(`code`);

ALTER TABLE `user_tbl` ADD `is_verified` BOOLEAN NULL AFTER `facebookId`;