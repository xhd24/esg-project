-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        12.0.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- esg_app_single 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `esg_app_single` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `esg_app_single`;

-- 테이블 esg_app_single.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `password_confirm_hash` varchar(100) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `category` enum('조선','자동차') NOT NULL,
  `gender` enum('MALE','FEMALE') NOT NULL,
  `position` enum('사원','대리','과장') NOT NULL,
  `department` enum('ESG전략팀','환경/에너지 팀','IR/공시팀') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_login` (`login_id`),
  KEY `ix_users_login_like` (`login_id`),
  KEY `ix_users_company` (`company_name`),
  KEY `ix_users_category` (`category`),
  KEY `ix_users_dept_pos` (`department`,`position`),
  CONSTRAINT `ck_login_id_format` CHECK (char_length(`login_id`) between 4 and 30 and `login_id` regexp '^[A-Za-z0-9_]+$'),
  CONSTRAINT `ck_password_hash_len` CHECK (char_length(`password_hash`) >= 40),
  CONSTRAINT `ck_password_confirm_hash_len` CHECK (char_length(`password_confirm_hash`) >= 40),
  CONSTRAINT `ck_company_name_not_blank` CHECK (trim(`company_name`) <> '')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 esg_app_single.users:~0 rows (대략적) 내보내기

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
