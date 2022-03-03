﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Dtos.Authentication;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
	public class UserService : IUserService
	{
		private readonly UserManager<User> _userManager;
		private readonly IConfiguration _configuration;

		public UserService(UserManager<User> userManager, IConfiguration configuration)
		{
			this._userManager = userManager;
			this._configuration = configuration;
		}

		public async Task RegisterAsync(RegisterUserDto registerUserDto)
		{
			var user = new User
			{
				UserName = registerUserDto.Email,
				Email = registerUserDto.Email
			};

			IdentityResult result = await _userManager.CreateAsync(user, registerUserDto.Password);

			if (!result.Succeeded)
			{
				Console.WriteLine(result.Errors.ToString());
				IEnumerable<string> errorList = result.Errors.ToList().Select(error => error.Description);
				string formattedErrors = string.Join("\n", errorList);
				throw new ApplicationException(formattedErrors);
			}
		}

		public async Task<string?> LoginUser(LoginUserDto loginUserDto)
		{
			var user = await _userManager.FindByEmailAsync(loginUserDto.Email);

			if (user == null)
				throw new ApplicationException("Username does not exist.");

			var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginUserDto.Password);
			if (!isPasswordCorrect)
				throw new ApplicationException("Password incorrect.");

			var authenticationClaims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var authenticationSingingKey =
				new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

			var token = new JwtSecurityToken(
				issuer: _configuration["JWT:ValidIssuer"],
				audience: _configuration["JWT:ValidAudience"],
				expires: DateTime.Now.AddMonths(1),
				claims: authenticationClaims,
				signingCredentials: new SigningCredentials(
					authenticationSingingKey,
					SecurityAlgorithms.HmacSha256
				)
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}