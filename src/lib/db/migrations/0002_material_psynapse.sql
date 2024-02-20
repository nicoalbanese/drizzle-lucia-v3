ALTER TABLE `user` RENAME COLUMN `username` TO `email`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_username_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);