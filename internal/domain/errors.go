package domain

import "errors"

var (
	ErrNotFound       = errors.New("resource not found")
	ErrUnauthorized   = errors.New("unauthorized access")
	ErrInvalidInput   = errors.New("invalid input data")
	ErrDuplicateSlug  = errors.New("case study slug already exists")
	ErrInternalServer = errors.New("internal server error")
)
