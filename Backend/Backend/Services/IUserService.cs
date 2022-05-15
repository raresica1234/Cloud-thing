﻿using System.Threading.Tasks;
using Backend.Dtos.Authentication;

namespace Backend.Services
{
	public interface IUserService
	{
		Task RegisterAsync(RegisterUserDto registerUserDto);

		Task<string?> LoginUser(LoginUserDto loginUserDto);
		
		Task<bool> IsAdministrator();
	}
}