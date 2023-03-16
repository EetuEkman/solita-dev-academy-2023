#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["solita-dev-academy-2023-server.csproj", "."]
RUN dotnet restore "./solita-dev-academy-2023-server.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "solita-dev-academy-2023-server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "solita-dev-academy-2023-server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "solita-dev-academy-2023-server.dll"]